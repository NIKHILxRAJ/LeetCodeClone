import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosclient';
import { useNavigate } from 'react-router-dom';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),

  visibletestcases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),

  hiddentestcases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required')
});

function AdminPanel() {

  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibletestcases: [
        {
          input: '',
          output: '',
          explanation: ''
        }
      ],

      hiddentestcases: [
        {
          input: '',
          output: ''
        }
      ],

      tags: 'array',
      difficulty: 'easy'
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibletestcases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddentestcases'
  });

  const onSubmit = async (data) => {

    data.startcode = [
      {
        language: "cpp",
        initialcode:
`#include<iostream>
using namespace std;

int main(){

}`
      }
    ];

    try {

      console.log(data);

      await axiosClient.post(
  '/problem/create',
  data
);
      navigate('/');

    } catch (error) {

      console.log(error);

      alert(
        'Error: ' +
        (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-xl font-bold mb-6">
        Create New Problem
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* Basic Information */}

        <div className="card bg-base-100 shadow-lg p-6">

          <h2 className="text-xl font-semibold mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">

            {/* Title */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Title
                </span>
              </label>

              <input
                {...register('title')}
                className={`input input-bordered ${
                  errors.title && 'input-error'
                }`}
              />

            </div>

            {/* Description */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Description
                </span>
              </label>

              <textarea
                {...register('description')}
                className={`textarea textarea-bordered h-32 ${
                  errors.description && 'textarea-error'
                }`}
              />

            </div>

            {/* Difficulty + Tags */}

            <div className="grid grid-cols-2 gap-4">

              <div className="form-control">

                <label className="label">
                  <span className="label-text">
                    Difficulty
                  </span>
                </label>

                <select
                  {...register('difficulty')}
                  className="select select-bordered"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

              </div>

              <div className="form-control">

                <label className="label">
                  <span className="label-text">
                    Tags
                  </span>
                </label>

                <select
                  {...register('tags')}
                  className="select select-bordered"
                >
                  <option value="array">Array</option>
                  <option value="linkedList">
                    Linked List
                  </option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>

              </div>

            </div>

          </div>
        </div>

        {/* Visible Test Cases */}

        <div className="card bg-base-100 shadow-lg p-6">

          <div className="flex justify-between items-center mb-4">

            <h3 className="font-medium">
              Visible Test Cases
            </h3>

            <button
              type="button"
              onClick={() =>
                appendVisible({
                  input: '',
                  output: '',
                  explanation: ''
                })
              }
              className="btn btn-sm btn-primary"
            >
              Add Visible Case
            </button>

          </div>

          {visibleFields.map((field, index) => (

            <div
              key={field.id}
              className="border p-4 rounded-lg space-y-2 mb-4"
            >

              <input
                {...register(
                  `visibletestcases.${index}.input`
                )}
                placeholder="Input"
                className="input input-bordered w-full"
              />

              <input
                {...register(
                  `visibletestcases.${index}.output`
                )}
                placeholder="Output"
                className="input input-bordered w-full"
              />

              <input
                {...register(
                  `visibletestcases.${index}.explanation`
                )}
                placeholder="Explanation"
                className="input input-bordered w-full"
              />

              <button
                type="button"
                onClick={() => removeVisible(index)}
                className="btn btn-xs btn-error"
              >
                Remove
              </button>

            </div>
          ))}

        </div>

        {/* Hidden Test Cases */}

        <div className="card bg-base-100 shadow-lg p-6">

          <div className="flex justify-between items-center mb-4">

            <h3 className="font-medium">
              Hidden Test Cases
            </h3>

            <button
              type="button"
              onClick={() =>
                appendHidden({
                  input: '',
                  output: ''
                })
              }
              className="btn btn-sm btn-primary"
            >
              Add Hidden Case
            </button>

          </div>

          {hiddenFields.map((field, index) => (

            <div
              key={field.id}
              className="border p-4 rounded-lg space-y-2 mb-4"
            >

              <input
                {...register(
                  `hiddentestcases.${index}.input`
                )}
                placeholder="Input"
                className="input input-bordered w-full"
              />

              <input
                {...register(
                  `hiddentestcases.${index}.output`
                )}
                placeholder="Output"
                className="input input-bordered w-full"
              />

              <button
                type="button"
                onClick={() => removeHidden(index)}
                className="btn btn-xs btn-error"
              >
                Remove
              </button>

            </div>
          ))}

        </div>

        <div className="flex justify-end">

          <button
            type="submit"
            className="btn btn-primary"
          >
            Create Problem
          </button>

        </div>

      </form>
    </div>
  );
}

export default AdminPanel;